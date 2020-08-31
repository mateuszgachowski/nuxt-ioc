// Disable POJO error
import Vue from 'vue';
// @ts-ignore
import container from '<%= options.containerPath %>';
console.log('Installing container to vue proto...');
Vue.prototype.__container = container;
