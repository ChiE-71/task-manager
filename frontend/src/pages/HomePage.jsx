import Tasks from "./Tasks";

function HomePage() {
  return (
    <div className="bg-background text-font">
      <div className="login-page flex flex-col items-center  min-h-screen">
        <div className="my-10">
          <h1 className="font-heading text-4xl font-semibold">TASK MANAGER</h1>
        </div>
        <div className="bg-font w-full h-0.5" />
        <div className="flex flex-col items-center gap-5 py-10">
          <Tasks />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
