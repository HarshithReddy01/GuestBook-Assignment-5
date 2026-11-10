import { PageLayout } from './PageLayout'

interface SetupRequiredProps {
  missingKeys: readonly string[]
}

export function SetupRequired({ missingKeys }: SetupRequiredProps) {
  return (
    <PageLayout>
      <section className="notice" role="alert">
        <h2>Configuration required</h2>
        <p>The following environment variables are missing:</p>
        <ul>
          {missingKeys.map((key) => (
            <li key={key}>
              <code>{key}</code>
            </li>
          ))}
        </ul>
        <p>
          Add them to the <code>.env</code> file in the project root and rebuild.
        </p>
      </section>
    </PageLayout>
  )
}
