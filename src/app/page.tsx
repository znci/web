import Image from "next/image"
import Link from "next/link"

type User = {
  username: string,
  profilePicture: string
}

export default function Home() {
  const user: User = {
    username: "cerq",
    profilePicture: "https://cdn.discordapp.com/avatars/464477495345938452/98b59d448647befa1efb218eefd69479"
  }
  // const user: User | any = {};
  const userValid = user && Object.keys(user).length > 0;

  return (
    <>
      <header>
        <nav className="flex justify-between items-center py-4 px-6 bg-slate-800">
          <div className="flex items-center">
            {/*  it looks bad  green clashes with blue ok where are the colors  then fix it im trying to fix it stop<Image src="https://avatars.githubusercontent.com/u/89603476?s=200&v=4" alt="znci logo" width={32} height={32} className="w-10 h-10 rounded-md mr-4" /> */}
            <h1 className="font-bold text-3xl">web</h1>
          </div>

          <div>
            { userValid ? (<Link href="/dashboard" className="flex items-center flex-row-reverse">
              <Image src={user.profilePicture} alt="znci logo" width={32} height={32} className="w-10 h-10 rounded-full ml-4" />
              <p className="ml-4 text-lg underline underline-offset-2">{user.username}</p>
            </Link>): (
              <Link href="/login" className="text-lg underline underline-offset-2">Login</Link>
            ) }
            
          </div>
        </nav>
      </header>

      <main>
        <div className="flex justify-center items-center py-32">
          <h1 className="text-6xl font-bold text-center md:text-9xl">Build it with blocks.</h1>
        </div>
      </main>

      <footer></footer>
    </>
  )
}