function (doc) {
  // retrieve only fields necessary for listing buildings
  if(doc.data && doc.data.type === 'building') {
    emit(doc._id, {
      name: doc.name,
    });
  }

}