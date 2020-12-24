export default async function ({ route, redirect, ...rest }) {
  // Parse route object and create unified route payload
  const { path } = route;
  if (path === '/redirectTest') {
    console.log('redirect also works');
    redirect('/');
  }
}
