import type { SetOptionOpts } from 'echarts';

export const initOptions: InitOptions = {
  renderer: 'svg',
};
export const updateOptions: SetOptionOpts = {
  notMerge: true,
};

/**
 * https://echarts.apache.org/en/api.html#echarts.init
 */
interface InitOptions {
  renderer: 'canvas' | 'svg';
}
