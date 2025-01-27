import { languageListSelector, specialityListSelector } from '@/redux/selector';

const useLanguage = (list: string[]) => {
  const languageList = languageListSelector();
  if (list?.length > 0) {
    return list.map(item => {
      const language = languageList.find((lang: any) => lang.id === item);
      return language?.name;
    });
  }
  return [];
};

const useSpeciality = (list: string[]) => {
  const specialityList = specialityListSelector();
  if (list?.length > 0) {
    return list.map(item => {
      const speciality = specialityList.find((spec: any) => spec.id === item);
      return speciality?.name;
    });
  }
  return [];
};

export { useLanguage, useSpeciality };
