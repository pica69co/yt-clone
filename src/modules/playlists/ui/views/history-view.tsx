import { HistoryVideosSection } from "../sections/history-videos-section";

const HistoryView = () => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      {" "}
      <div className="">
        <h1 className="text-2xl font-bold">History Views</h1>
        <p className="text-xs text-muted-foreground">Recently viewed</p>
      </div>
      <HistoryVideosSection />
    </div>
  );
};

export default HistoryView;
