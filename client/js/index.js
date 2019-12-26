window.onload = () => {
  // fetch('http://ip-api.com/json/', {
    fetch('https://ipapi.co/json/', {
    method: 'GET',
  })
  .then(resp => resp.json())
  // .then(data => console.log(data));
  .then(data => {
    console.log(data);
    fetch('http://localhost:8080/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  });
}