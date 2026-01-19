import logoSefaz from "../../assets/images/logo-azul.png";

const Home = () => {
  return (
    <>
      <main className="flex flex-row gap-2 items-start justify-start p-4 overflow-hidden">
        <div className="flex flex-col gap-2 items-start justify-start w-full">
          <div className="flex flex-col gap-2 w-full p-5 welcome-step-target calendar-container">
            <div className={`relative w-full`}>
              <input type="search" className="placeholder:italic pr-10" />

              <img src={logoSefaz} alt="logo SEFAZ" width={180} height={58} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
