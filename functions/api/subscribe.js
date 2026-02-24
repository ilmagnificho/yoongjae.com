export async function onRequestPost(context) {
  const { request } = context;

  let email;
  try {
    const body = await request.formData();
    email = body.get('email');
  } catch {
    return new Response(JSON.stringify({ ok: false, message: '잘못된 요청입니다.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!email) {
    return new Response(JSON.stringify({ ok: false, message: '이메일을 입력해주세요.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stibeeRes = await fetch(
    'https://stibee.com/api/v1.0/lists/474769/public/subscribers',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email }).toString(),
    }
  );

  const text = await stibeeRes.text();

  // Stibee 응답 로그 (Cloudflare 대시보드에서 확인 가능)
  console.log('Stibee status:', stibeeRes.status);
  console.log('Stibee response:', text);

  if (stibeeRes.ok) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: false, message: '등록에 실패했습니다. 다시 시도해주세요.' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
