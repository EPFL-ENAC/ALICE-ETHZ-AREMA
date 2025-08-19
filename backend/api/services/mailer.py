import smtplib
from email.message import EmailMessage
from jinja2 import Environment, PackageLoader, select_autoescape
from api.config import config
from api.auth import kc_service, User, kc_admin_service

# Setup Jinja2 to load templates from inside the package
env = Environment(
    loader=PackageLoader("api", "templates"),
    autoescape=select_autoescape(["html", "xml"])
)


class Mailer:
    """Mailer service to send emails using SMTP and Jinja2 templates"""

    def __init__(self):
        self.smtp_host = config.SMTP_HOST
        self.smtp_port = config.SMTP_PORT
        self.smtp_email = config.SMTP_EMAIL
        self.smtp_name = config.SMTP_NAME
        self.smtp_password = config.SMTP_PASSWORD
        self.smtp_username = config.SMTP_USERNAME
        self.smtp_subject_prefix = config.SMTP_SUBJECT_PREFIX

    async def send_review_assigned_email(self, entity_type: str, entity_id: int, entity_name: str, assignee: str):
        """Send an email to the assignee when a review is assigned"""
        user = await kc_admin_service.get_user(assignee)
        if not user:
            return
        subject = f"Review assigned for {self._get_entity_type_name(entity_type)}: {entity_name} #{entity_id}"
        url = f"https://atlas-regenmat.ch/admin/{self._get_entity_type_path(entity_type)}"
        context = {
            "url": url,
            "entity_type": self._get_entity_type_name(entity_type),
            "entity_name": entity_name,
            "entity_id": entity_id,
            "full_name": self._get_full_name(user),
        }
        self.send_email(user.email, subject, "review_assigned.html", context)

    def send_email(self, to_email: str, subject: str, template_name: str, context: dict):
        """Send an email using a Jinja2 template"""
        template = env.get_template(template_name)
        body = template.render(context)

        msg = EmailMessage()
        msg.set_content(body)
        msg.add_alternative(body, subtype='html')
        msg["Subject"] = f"{self.smtp_subject_prefix} {subject}" if self.smtp_subject_prefix else subject
        msg["From"] = f"{self.smtp_name} <{self.smtp_email}>"
        msg["To"] = to_email

        with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
            if self.smtp_username and self.smtp_password:
                server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)

    def _get_full_name(self, user: User) -> str:
        """Get the full name of a user"""
        if isinstance(user.first_name, str) and user.first_name:
            if not (isinstance(user.last_name, str) and user.first_name.endswith(user.last_name)):
                return f"{user.first_name} {user.last_name}"
            else:
                return user.first_name
        return user.username if user.username else "Unknown User"

    def _get_entity_type_path(self, entity_type: str) -> str:
        """Get the path for the entity type"""
        if entity_type == "technical-construction":
            return "construction-techniques"
        elif entity_type == "natural-resource":
            return "resources"
        else:
            return f"{entity_type}s"

    def _get_entity_type_name(self, entity_type: str) -> str:
        """Get the path for the entity type"""
        if entity_type == "technical-construction":
            return "construction-technique"
        elif entity_type == "natural-resource":
            return "resource"
        else:
            return entity_type.replace("-", " ")
