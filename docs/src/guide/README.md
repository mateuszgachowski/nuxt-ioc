# Introduction

`nuxt-ioc` is a implementation of IoC/DI patterns working with [Nuxt.js](https://nuxtjs.org/)

::: tip
This library is intended for TypeScript development only. Vanilla-JS is not supported due to need of use of decorators.
:::

Our concepts are based on [IoC](https://en.wikipedia.org/wiki/Inversion_of_control), [DI](https://en.wikipedia.org/wiki/Dependency_injection) and heavily inspired by great frameworks like [Java Spring](https://spring.io/) and [Nest.js](https://nestjs.com/).

You might also see similarities to [Angular framework](https://angular.io/guide/dependency-injection) but those are rather by just using same concepts of DI. Differently from angular `nuxt-ioc` tries to be simple and keep the low-entry level for which we all love Vue.js for.

Currently in a stable beta version `nuxt-ioc` allows you to quickly start your journey in object-oriented programing still using Vue.js **simplicity** and **flat learning curve**.

`nuxt-ioc` provides a set of _decorators_, _helpers_ and _tools_ that will ease your development journey allowing you to keep your code clean and structurized even for big-scale front-end projects.

Under the hood `nuxt-ioc` uses great [Inversify](http://inversify.io/) library.

# Motivation

[Vue.js](https://vuejs.org/) is a great and simple framework. [Nuxt.js](https://nuxtjs.org/) organizes basic concepts of SSR, middleware and provides simple structure for files. `nuxt-ioc` is ment to be the next level of making this ecosystem more of a framework than a set of libraries zipped together.
At the time of creation of `nuxt-ioc` there were no easy solutions allowing similar syntax-sugar and DI approach for Vue.js/Nuxt applications. Similar can be found but does not solve the problem typically for typescript nor implement full IoC containers.

Several sources that mention vue/nuxt IoC approaches:

- [IoC container pattern with Vue](https://markus.oberlehner.net/blog/the-ioc-container-pattern-with-vue/) (implementation requires vue `provide` syntax)
- [vue-ioc](https://github.com/vue-ioc/vue-ioc) (is more angular-like, forces to manage dependencies from Root component files instead of dedicated typescript file like in `nuxt-ioc`)
