import { technicalConstructionBuildingMaterial } from './technical-construction-building-material/technical-construction-building-material'
import { buildingMaterialNaturalResource } from './building-material-natural-resource/building-material-natural-resource'
import { buildingProfessional } from './building-professional/building-professional'
import { building } from './building/building'
import { technicalConstruction } from './technical-construction/technical-construction'
import { professionalType } from './professional-type/professional-type'
import { professional } from './professional/professional'
import { buildingMaterial } from './building-material/building-material'
import { naturalResource } from './natural-resource/natural-resource'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(technicalConstructionBuildingMaterial)
  app.configure(buildingMaterialNaturalResource)
  app.configure(buildingProfessional)
  app.configure(building)
  app.configure(technicalConstruction)
  app.configure(professionalType)
  app.configure(professional)
  app.configure(buildingMaterial)
  app.configure(naturalResource)
  app.configure(user)
  // All services will be registered here
}
