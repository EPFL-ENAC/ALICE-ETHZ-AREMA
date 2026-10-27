from enacit4r_auth.models.auth import AppUser, AppUserDraft, AppUserPassword
from enacit4r_sql.models.query import ListResult

__all__ = ["AppUser", "AppUserDraft", "AppUserPassword", "AppUserResult"]


class AppUserResult(ListResult):
    data: list[AppUser] = []
