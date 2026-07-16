import { signIn, signOut } from "@/auth";

export function SignInForm({
  className,
  buttonClassName,
  label,
}: {
  className?: string;
  buttonClassName: string;
  label: string;
}) {
  return (
    <form
      className={className}
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <button type="submit" className={buttonClassName}>
        {label}
      </button>
    </form>
  );
}

export function SignOutForm({
  className,
  buttonClassName,
  label,
}: {
  className?: string;
  buttonClassName: string;
  label: string;
}) {
  return (
    <form
      className={className}
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit" className={buttonClassName}>
        {label}
      </button>
    </form>
  );
}
