import click
from flask.cli import with_appcontext


@click.command('reset-training-counts')
@with_appcontext
def reset_training_counts():
    """
    Reset training_count for all users back to 0.
    Useful for periodic resets on the demo instance.
    """
    from app import db
    from app.models.user import User

    users = User.query.all()
    count = 0
    for user in users:
        if (user.training_count or 0) > 0:
            click.echo(f"  Resetting {user.username} (count={user.training_count})")
            user.training_count = 0
            count += 1

    db.session.commit()
    click.echo(f"Reset training counts for {count} users.")


def register_commands(app):
    app.cli.add_command(reset_training_counts)
