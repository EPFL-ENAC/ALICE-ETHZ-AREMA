## États

Chaque document (ressource, matériau de construction, etc.) peut avoir l'un des états suivants :

| État               | Description                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| **Brouillon**      | Le document est en cours d'ajout ou de modification et n'est pas encore prêt pour la révision.                |
| **En révision**    | Le document est prêt à être examiné par un réviseur.                                                          |
| **À publier**      | Le document a été révisé et approuvé pour publication par un réviseur.                                        |
| **À dépublier**    | Le document est actuellement publié et doit être dépublié par un administrateur.                              |
| **À supprimer**    | Le document est marqué pour suppression par un administrateur.                                                |
| **Verrouillé**     | Le document est verrouillé par un administrateur et ne peut être modifié, (dé)publié ou supprimé.             |

## Rôles

Le flux de publication implique différents rôles, chacun disposant de permissions spécifiques :

| Rôle                  | Permissions                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **Contributeur**      | Peut ajouter et modifier ses propres documents.                                                |
| **Réviseur**          | Peut ajouter et modifier tous les documents, mais ne peut pas les (dé)publier ni les supprimer.|
| **Administrateur**    | Peut effectuer toutes les opérations, y compris la (dé)publication et la suppression.          |

## Transitions

Le diagramme suivant illustre le flux de publication des documents et les responsabilités des différents rôles :

![Flux de publication AREMA](images/arema-publication-flow.png 'Flux de publication AREMA')
