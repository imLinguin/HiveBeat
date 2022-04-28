export function getSharedElements(route, otherRoute, showing) {
  let id =
    otherRoute.params?.id ||
    otherRoute.params?.data?.playlistId ||
    otherRoute.params?.data?.albumId ||
    otherRoute.params?.data?.artistId;

  if (!id) {
    return [];
  }
  console.log(
    `Route ${route.params.name}`,
    `OtherRoute: ${otherRoute.params.name}`,
  );

  if (route.name == 'Artist' && showing) {
    return [`${route.params.id}.artistthumbnail`];
  }

  return [
    {id: `${id}.thumbnail`, animation: 'move'},
    {id: `${id}.artistthumbnail`, animation: 'move'},
  ];
}
