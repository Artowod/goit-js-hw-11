HTTP-запросы
В качестве бэкенда используй публичный API сервиса Pixabay. Зарегистрируйся, получи свой уникальный ключ доступа и ознакомься с документацией.

Список параметров строки запроса которые тебе обязательно необходимо указать:

key - твой уникальный ключ доступа к API.
q - термин для поиска. То, что будет вводить пользователь.
image_type - тип изображения. Мы хотим только фотографии, поэтому задай значение photo.
orientation - ориентация фотографии. Задай значение horizontal.
safesearch - фильтр по возрасту. Задай значение true.

В ответ прийдут рисунки - у ни обрабатываем:
webformatURL - ссылка на маленькое изображение для списка карточек.
largeImageURL - ссылка на большое изображение.
tags - строка с описанием изображения. Подойдет для атрибута alt.
likes - количество лайков.
views - количество просмотров.
comments - количество комментариев.
downloads - количество загрузок.
Если бэкенд возвращает пустой массив, значит ничего подходящего найдено небыло. В таком случае показывай уведомление с текстом "Sorry, there are no images matching your search query. Please try again."