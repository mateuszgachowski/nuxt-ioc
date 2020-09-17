# Module settings

As nuxt-ioc works as a nuxt.js module, we can also pass settings to the module.

Currently we have just one setting that you can override and its `containerPath` used by module.

To override it, simply pass another path to module settings:

```ts
modules: [['nuxt-ioc', { containerPath: '~/App/container' }]];
```

## Options

| Option name   |  type  |           default value |
| ------------- | :----: | ----------------------: |
| containerPath | String | ~/Application/container |
