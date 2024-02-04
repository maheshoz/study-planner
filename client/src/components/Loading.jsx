import { Circles } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="w-full mt-6 block mx-auto flex justify-center">
      <Circles
        height='80'
        width='80'
        color='#4fa94d'
        ariaLabel='circles-loading'
        wrapperStyle={{}}
        wrapperClass=''
        visible={true}
      />
    </div>
  );
}
