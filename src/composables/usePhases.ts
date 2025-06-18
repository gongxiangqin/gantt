import useStore from '@/store';

export default () => {
  const store = useStore();

  return {
    $phases: store.$phases
  };
};