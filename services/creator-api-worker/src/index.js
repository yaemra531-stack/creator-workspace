/**
 * 瓦斯创作者宇宙 · Cloudflare D1 Serverless API 网关
 * 服务个人博客 (personal-blog) 与日记系统 (diary-content-system) 跨端实时同步
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Gas-Key',
  'Access-Control-Max-Age': '86400',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

function error(message, status = 400) {
  return json({ error: message }, status);
}

function isAuthorized(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const gasKey = request.headers.get('X-Gas-Key') || '';
  const expectedKey = env.AUTH_KEY || 'gas';

  return token === expectedKey || gasKey === expectedKey;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();
    const pathname = url.pathname.replace(/\/$/, '');

    // 1. CORS Preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    const db = env.DB;
    if (!db) {
      return error('D1 Database binding `DB` is not configured', 500);
    }

    try {
      // ---------------- 健康检查 ----------------
      if (pathname === '/api/health' || pathname === '') {
        return json({
          status: 'ok',
          service: 'creator-api-worker',
          timestamp: new Date().toISOString(),
        });
      }

      // ---------------- 21天挑战打卡 (Challenge Logs) ----------------
      if (pathname === '/api/challenge') {
        if (method === 'GET') {
          const { results } = await db
            .prepare('SELECT * FROM challenge_logs ORDER BY day ASC')
            .all();
          
          // 格式化为前端熟悉的驼峰属性
          const logs = (results || []).map(r => ({
            day: r.day,
            date: r.date,
            status: r.status,
            isDual: Boolean(r.is_dual),
            type: r.type,
            title: r.title,
            ieltsTitle: r.ielts_title,
            ieltsNote: r.ielts_note,
            thoughtNote: r.thought_note,
            note: r.note,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          }));

          return json({ logs });
        }

        if (method === 'POST') {
          if (!isAuthorized(request, env)) return error('Unauthorized: 站长口令无效', 401);
          const body = await request.json();
          if (!body || typeof body.day !== 'number') return error('Invalid payload: day is required');

          const now = new Date().toISOString();
          await db
            .prepare(`
              INSERT INTO challenge_logs (day, date, status, is_dual, type, title, ielts_title, ielts_note, thought_note, note, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(day) DO UPDATE SET
                date = excluded.date,
                status = excluded.status,
                is_dual = excluded.is_dual,
                type = excluded.type,
                title = excluded.title,
                ielts_title = excluded.ielts_title,
                ielts_note = excluded.ielts_note,
                thought_note = excluded.thought_note,
                note = excluded.note,
                updated_at = excluded.updated_at
            `)
            .bind(
              body.day,
              body.date || now.split('T')[0],
              body.status || 'completed',
              body.isDual ? 1 : 0,
              body.type || '🌟 双轨双满贯',
              body.title || '今日打卡',
              body.ieltsTitle || '',
              body.ieltsNote || '',
              body.thoughtNote || '',
              body.note || '',
              now
            )
            .run();

          return json({ ok: true, day: body.day }, 201);
        }
      }

      // 单条挑战记录更新与删除 /api/challenge/:day
      const challengeDayMatch = pathname.match(/^\/api\/challenge\/(\d+)$/);
      if (challengeDayMatch) {
        const day = parseInt(challengeDayMatch[1], 10);

        if (method === 'PUT') {
          if (!isAuthorized(request, env)) return error('Unauthorized: 站长口令无效', 401);
          const body = await request.json();
          const now = new Date().toISOString();

          await db
            .prepare(`
              UPDATE challenge_logs SET
                title = COALESCE(?, title),
                ielts_title = COALESCE(?, ielts_title),
                ielts_note = COALESCE(?, ielts_note),
                thought_note = COALESCE(?, thought_note),
                note = COALESCE(?, note),
                updated_at = ?
              WHERE day = ?
            `)
            .bind(
              body.title ?? null,
              body.ieltsTitle ?? null,
              body.ieltsNote ?? null,
              body.thoughtNote ?? null,
              body.note ?? null,
              now,
              day
            )
            .run();

          return json({ ok: true, day });
        }

        if (method === 'DELETE') {
          if (!isAuthorized(request, env)) return error('Unauthorized: 站长口令无效', 401);
          await db.prepare('DELETE FROM challenge_logs WHERE day = ?').bind(day).run();
          return json({ ok: true, deletedDay: day });
        }
      }

      // ---------------- 灵感速记 (Thoughts Stream) ----------------
      if (pathname === '/api/thoughts') {
        if (method === 'GET') {
          const { results } = await db
            .prepare('SELECT * FROM thoughts ORDER BY date DESC, time DESC, created_at DESC')
            .all();
          return json({ thoughts: results || [] });
        }

        if (method === 'POST') {
          if (!isAuthorized(request, env)) return error('Unauthorized: 站长口令无效', 401);
          const body = await request.json();
          if (!body || !body.content) return error('Invalid payload: content is required');

          const now = new Date();
          const id = body.id || `t-${Date.now()}`;
          const date = body.date || now.toISOString().split('T')[0];
          const time = body.time || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          const location = body.location || '书房';

          await db
            .prepare(`
              INSERT INTO thoughts (id, date, time, content, location, updated_at)
              VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                content = excluded.content,
                location = excluded.location,
                updated_at = excluded.updated_at
            `)
            .bind(id, date, time, body.content.trim(), location, now.toISOString())
            .run();

          return json({ ok: true, id }, 201);
        }
      }

      // 单条速记更新与删除 /api/thoughts/:id
      const thoughtIdMatch = pathname.match(/^\/api\/thoughts\/([^/]+)$/);
      if (thoughtIdMatch) {
        const id = decodeURIComponent(thoughtIdMatch[1]);

        if (method === 'PUT') {
          if (!isAuthorized(request, env)) return error('Unauthorized: 站长口令无效', 401);
          const body = await request.json();
          const now = new Date().toISOString();

          await db
            .prepare(`
              UPDATE thoughts SET
                content = COALESCE(?, content),
                location = COALESCE(?, location),
                updated_at = ?
              WHERE id = ?
            `)
            .bind(body.content ?? null, body.location ?? null, now, id)
            .run();

          return json({ ok: true, id });
        }

        if (method === 'DELETE') {
          if (!isAuthorized(request, env)) return error('Unauthorized: 站长口令无效', 401);
          await db.prepare('DELETE FROM thoughts WHERE id = ?').bind(id).run();
          return json({ ok: true, deletedId: id });
        }
      }

      // ---------------- 全局点赞 (Target Likes) ----------------
      if (pathname === '/api/likes') {
        if (method === 'GET') {
          const { results } = await db.prepare('SELECT target_id, likes_count FROM target_likes').all();
          const map = {};
          (results || []).forEach(r => {
            map[r.target_id] = r.likes_count;
          });
          return json({ likes: map });
        }

        if (method === 'POST') {
          const body = await request.json();
          if (!body || !body.targetId) return error('Invalid payload: targetId is required');

          const now = new Date().toISOString();
          const record = await db
            .prepare(`
              INSERT INTO target_likes (target_id, likes_count, updated_at)
              VALUES (?, 1, ?)
              ON CONFLICT(target_id) DO UPDATE SET
                likes_count = likes_count + 1,
                updated_at = excluded.updated_at
              RETURNING likes_count
            `)
            .bind(body.targetId, now)
            .first();

          return json({
            targetId: body.targetId,
            likesCount: record ? record.likes_count : 1,
          });
        }
      }

      return error('Endpoint not found', 404);
    } catch (err) {
      console.error('API Worker error:', err);
      return error(`Internal Server Error: ${err.message}`, 500);
    }
  },
};
