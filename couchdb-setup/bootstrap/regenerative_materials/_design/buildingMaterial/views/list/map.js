function (doc) {
  // retrieve only fields necessary for listing buildingMaterials
  if(doc.data && doc.data.type === 'buildingMaterial') {
    emit(doc._id, {
      name: doc.name,
    });
  }

}