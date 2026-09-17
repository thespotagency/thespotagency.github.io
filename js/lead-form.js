(function(){
  var SUPABASE_URL = 'https://yhwxhgctomykuykhpcyz.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_-xN2OnU0MqYBczv79Lh45g_q55bK3pA';
  var NOTIFY_URL = 'https://spot-leads-dashboard.vercel.app/api/notify';

  var form = document.getElementById('leadForm');
  if(!form) return;
  var errEl = document.getElementById('lf-error');
  var btn = document.getElementById('lf-submit');
  var btnDefaultText = btn ? btn.textContent : '';

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(errEl){ errEl.style.display = 'none'; }
    if(btn){ btn.disabled = true; btn.textContent = 'Submitting...'; }

    var payload = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      business_name: form.business_name.value.trim(),
      business_type: form.business_type.value,
      monthly_budget: form.monthly_budget.value,
      message: form.message.value.trim() || null
    };

    fetch(SUPABASE_URL + '/rest/v1/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    }).then(function(res){
      if(!res.ok){ throw new Error('Insert failed: ' + res.status); }
      try{
        fetch(NOTIFY_URL, {
          method: 'POST',
          mode: 'cors',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        })['catch'](function(){});
      }catch(e){}
      window.location.href = 'thank-you.html';
    })['catch'](function(err){
      if(btn){ btn.disabled = false; btn.textContent = btnDefaultText; }
      if(errEl){
        errEl.textContent = 'Something went wrong. Please try again or message us on WhatsApp directly.';
        errEl.style.display = 'block';
      }
      console.error(err);
    });
  });
})();