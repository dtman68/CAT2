// �w�q Service Worker ���֨��W�٩M����
const CACHE_NAME = 'yellow-cat-pet-app-v1';
// �w�q�n�֨����Ҧ��ɮצC��
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // �o�O�@�ӳq�Ϊ� Tailwind CSS CDN URL�A�T�O���ε{�����u�ɤ]�ॿ�T��ܼ˦��C
  'https://cdn.tailwindcss.com',
  // �o�O�@�ӳq�Ϊ� Google Fonts URL�A�T�O���ε{�����u�ɦr��ॿ�`��ܡC
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

// ��ť Service Worker �� 'install' �ƥ�
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // ����֨��Ҧ��귽���ާ@
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// ��ť Service Worker �� 'fetch' �ƥ�
self.addEventListener('fetch', (event) => {
  // �d�I�Ҧ������ШD
  event.respondWith(
    // �ˬd�֨����O�_�w���ШD���귽
    caches.match(event.request)
      .then((response) => {
        // �p�G�֨������A�h�����^�ǧ֨������귽
        if (response) {
          console.log('Service Worker: Found in cache', event.request.url);
          return response;
        }
        // �p�G�֨����S���A�h�q��������귽�æP�ɱN��֨��_��
        console.log('Service Worker: Not in cache, fetching and caching', event.request.url);
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest)
          .then((fetchResponse) => {
            // �ˬd�^���O�_����
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // �ƻs�^���H�K�N���J�֨�
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          });
      })
  );
});

// ��ť Service Worker �� 'activate' �ƥ�
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // �M�z�ª��֨�
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
