function (doc) {
  // retrieve only fields necessary for listing buildingElements
  if(doc.data && doc.data.type === 'buildingElement') {
    emit(doc._id, {
      name: doc.name,
    });
  }

}