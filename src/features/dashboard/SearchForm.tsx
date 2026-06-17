type SearchFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function SearchForm({ value, onChange, onSubmit }: SearchFormProps) {
  return (
    <form
      className="search-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="search-form__label" htmlFor="github-username">
        GitHub username
      </label>
      <div className="search-form__row">
        <input
          id="github-username"
          name="username"
          type="search"
          autoComplete="off"
          placeholder="e.g. vercel"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button type="submit">Load dashboard</button>
      </div>
    </form>
  );
}
