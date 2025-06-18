import { XDate } from '../param/date';

export interface PhaseItem {
  name: string;
  startDate: XDate;
  endDate: XDate;
}

export default class Phases {
  phases: PhaseItem[] = [];

  /**
   * 初始化数据
   * @param data 展示的数据集合
   */
  init(phasesList: any[]) {
    phasesList.forEach(phase => {
      phase.startDate = new XDate(phase.startDate);
      phase.endDate = new XDate(phase.endDate);
    });
    this.phases = phasesList;
  }
}
