export async function onRequestPost(context) {
  const { request } = context;

  let email, name;
  try {
    const body = await request.formData();
    email = body.get('email');
    name = body.get('name') || '';
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

  const params = new URLSearchParams({ email });
  if (name) params.set('name', name);

  const stibeeRes = await fetch(
    'https://stibee.com/api/v1.0/lists/b-u-zuAfT1K6CYLofSqcWz4JC2OSSg==/public/subscribers',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    }
  );

  const text = await stibeeRes.text();
  console.log('Stibee status:', stibeeRes.status, 'response:', text.slice(0, 200));

  // Stibee returns HTML; a true success contains a confirmation message
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
