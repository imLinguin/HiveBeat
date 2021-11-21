export function getSharedElements(route, otherRoute, showing) {
  let id =
    otherRoute.params.id ||
    otherRoute.params?.data?.playlistId ||
    otherRoute.params?.data?.albumId ||
    otherRoute.params?.data?.artistId;
  // if (!id) return [];
  return [
    {id: `${id}.thumbnail`, animation: 'move'},
    {id: `${id}.artistthumbnail`, animation: 'move'},
  ];
}
