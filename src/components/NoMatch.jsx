import { Link, useLocation } from "react-router-dom";


export default function NoMatch() {
  let location = useLocation();

  return (
    <div className="mt-12 text-center ">
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
      <Link className="'bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-4" to={'/'}>Go home</Link>
    </div>
  )
}
