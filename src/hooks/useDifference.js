const useDifference = (time) => {
  const pastTime = new Date(time);
  const currenTime = new Date();

  const SEC = 1000;
  const MIN = SEC * 60;
  const HRS = MIN * 60;
  const DAY = HRS * 24;

  const dif = currenTime.getTime() - pastTime.getTime();

  const difDays = Math.round(dif / DAY);
  const difHrs = Math.round(dif / HRS);
  const difMin = Math.round(dif / MIN);

  if (difHrs >= 24) {
    return `${difDays > 1 ? `${difDays} Days ago` : `${difDays} Day ago`}`;
  }
  if (difMin >= 60) {
    return `${difHrs > 1 ? `${difHrs} Hours ago` : `${difHrs} Hour ago`}`;
  }
  if (difMin > 1) {
    return `${difMin} Mins ago`;
  } else {
    return `Just now`;
  }
};

export default useDifference;
