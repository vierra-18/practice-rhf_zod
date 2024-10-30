'use client';

import { useAlert } from './multiverse/AlertContext';

export default function Playground() {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const { addAlert } = useAlert();

  const handleTriggerAlert = () => {
    addAlert({
      title: 'New Alert',
      body: 'This is a new alert triggered externally.',
      state: 'danger',
      // hasTimer: false,
      duration: 5000,
      onClick: () => {
        console.log('yeet');
      },
    });
  };
  return (
    <div className="flex flex-wrap gap-5 rounded p-5">
      <button
        type="button"
        className="btn capitalize"
        onClick={handleTriggerAlert}
      >
        trigger alert
      </button>
      {/* <Alert
        title=""
        body=""
        state="danger"
        isActive={isModalOpen}
        actionLabel=""
        onClose={() => setIsModalOpen(false)}
        icon={RiInformationFill}
        onClick={() => {
          setIsModalOpen(false);
        }}
      /> */}
    </div>
  );
}
