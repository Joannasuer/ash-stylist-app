export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { email, source } = req.body;
  const listId = process.env.KLAVIYO_LIST_ID;
  const apiKey = process.env.KLAVIYO_PRIVATE_KEY; // Only the server sees this!

  if (!email || !listId || !apiKey) {
    return res.status(500).json({ error: 'Missing Server Configuration' });
  }

  try {
    // Send to Klaviyo securely
    const response = await fetch(`https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`, {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'revision': '2023-02-22',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            list_id: listId,
            custom_source: source || 'Ash App',
            profiles: {
              data: [{
                type: "profile",
                attributes: {
                  email: email,
                  subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } }
                }
              }]
            }
          }
        }
      })
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}