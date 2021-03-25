export default async function (context) {
  console.log('MIDDLEWARE', context.req.$__container);
}
