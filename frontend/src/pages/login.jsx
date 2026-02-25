import { URL } from "../util/url";

const Login = () => {
  const handleClick = () => {
    window.location.href = `${URL}/login?redirectUrl=${encodeURI(
      window.location.origin
    )}`;
  };

  return (
    <>
      <main className='bg-black text-white overflow-x-hidden h-screen w-screen m-0 p-0  box-border'>
        <header className=' flex justify-start items-start h-[20%] w-[100%] p-5 overflow-hidden'>
          <img src='/logo.svg' alt='' className='pr-1 h-[2.2rem]' />
          <h2 className='items-center text-[1.2rem] font-semibold'>SpotiDash</h2>
        </header>
        <article className='pt-[10vh] flex items-center justify-around flex-col h-[40%]'>
          <section className=' h-[auto] md:text-3xl text-2xl font-bold p-5'>
            Login to Countinue <br /> to SpotiDash
          </section>
          <section className=' h-[auto]'>
            <button
              className='text-black font-semibold bg-custonmGreen hover:bg-custonmGreenHover min-w-[15rem] aspect-[5/1] rounded-[30px] pt-[-80px] border-[5px] border-[rgba(0,0,0,0.2)]'
              onClick={handleClick}>
              Log in
            </button>
          </section>
        </article>
      </main>
    </>
  );
};

export default Login;
