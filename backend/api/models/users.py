from enacit4r_sql.models.query import ListResult
from enacit4r_auth.models.auth import AppUser, AppUserDraft, AppUserPassword


class AppUserResult(ListResult):
    data: list[AppUser] = []
