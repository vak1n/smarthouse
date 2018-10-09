# Яндекс Дом

https://vak1n.github.io/smarthouse/public/

### Разработка 

```sh
npm install
npm run dev
```

#### Сборка 

```sh
npm run build
```

#### Инструменты

- в качестве препроцессора css используется sass
- в качестве сборщика используется webpack
- normalize.css подключается через CDN
- в качестве линтера используется eslint c конофигом от airbnb
- в качестве шаблонизатора используется механизм для отложенного рендера клиентского контента `<template>`

### Первое задание «Адаптивная вёрстка»

Вёрстку адаптирована для экранов размером от 320px до 1920px по ширине

#### Шапка

- в мобильной версии шапка прибита к вверзу экрана
- в мобильной версии меню скрывается под 'шамбургер'
- меню рендерится на основе получаемых от сервера данных в фомате json

##### Подвал

- меню рендерится на основе все тех же получаемых данных

#### Карточка события

- карточки рендерятся на основе получаемых от сервера данных в фомате json
- у карточек без дополнительных данных показываются контролы (крестик и стрелка),
- на десктопе контолы показываются при наведении, на мобильных устройствах всегда

#### Копмоновка карточек

- плотная компоновка карточек сдкланана на гридах
- карточки занимают все свободное место, тобы не было пустоты

#### Дополнитеьно

- добавлена адаптивная типографика, шрифты указываются с еденицами `rem` относительно елемента `html`, 
    под разные экраны `html` задаются свои размеры
- изображения графика и камеры адаптивные
- иконки карточек выводятся разного размера, взависимости от ширины экрана

### Второе задание «Работа с сенсорным пользовательским вводом»

**WIP**
