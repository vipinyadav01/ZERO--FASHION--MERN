if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { 
    scope: '/', 
    type: 'module' 
  }).then((registration) => {
    console.log('Service Worker registered successfully:', registration);
  }).catch((error) => {
    console.log('Service Worker registration failed:', error);
  });
}