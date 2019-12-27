function addView(analyticsDomain) {
  fetch('https://ipapi.co/json/', {
  })
  .then(resp => resp.json())
  .then(data => {
    fetch(analyticsDomain, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  });
}

window.onload = addView('http://localhost:8080/analytics');
