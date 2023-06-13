function (doc) {
  // retrieve only fields necessary for listing professionals
  if(doc.data && doc.data.type === 'buildingMaterial') {
    emit(doc._id);
  }

}