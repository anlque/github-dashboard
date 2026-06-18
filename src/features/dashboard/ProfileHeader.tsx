import type { GithubUser } from '@/types/github';
import { formatDate, formatNumber } from '@/utils/format';

type ProfileHeaderProps = {
  user: GithubUser;
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <section className="profile-card">
      <img
        className="profile-card__avatar"
        src={user.avatar_url}
        alt={`${user.login} avatar`}
        width={88}
        height={88}
      />
      <div>
        <h2 className="profile-card__name">{user.name ?? user.login}</h2>
        <p className="profile-card__handle">
          <a href={user.html_url} target="_blank" rel="noreferrer">
            @{user.login}
          </a>
        </p>
        {user.bio ? <p className="profile-card__bio">{user.bio}</p> : null}
        <dl className="profile-card__meta">
          <div>
            <dt>Public repos</dt>
            <dd>{formatNumber(user.public_repos)}</dd>
          </div>
          <div>
            <dt>Followers</dt>
            <dd>{formatNumber(user.followers)}</dd>
          </div>
          <div>
            <dt>Joined</dt>
            <dd>{formatDate(user.created_at)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
