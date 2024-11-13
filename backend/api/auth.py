from api.config import config
from enacit4r_auth.services.auth import KeycloakService, User

kc_service = KeycloakService(config.KEYCLOAK_URL, config.KEYCLOAK_REALM,
                             config.KEYCLOAK_API_ID, config.KEYCLOAK_API_SECRET, "admin")
