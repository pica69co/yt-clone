import { SubscriptionsSection } from "../sections/subscriptions-section";

const SubscriptionsView = () => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      {" "}
      <div className="">
        <h1 className="text-2xl font-bold">All subscriptions</h1>
        <p className="text-xs text-muted-foreground">
          View & manage all your subscriptions
        </p>
      </div>
      <SubscriptionsSection />
    </div>
  );
};

export default SubscriptionsView;
