export const strokeIconStyle = {strokeWidth: 1}
export const rotated180 = {rotate: '180deg'}
export const buttonIconClasses = 'cursor-pointer w-6 h-6 rounded-full hover:bg-white/50 hover:text-black p-0.5 transition-colors duration-900'
export const lightTitleTextForeground = {color: 'black'}
export const darkTitleTextForeground = {color: 'white'}
export const thinIconStyle = {
  strokeWidth: 0.75,
}

export const pinnedSearchQueryClasses = `
  relative
  px-3
  py-1
  border-1
  border-primary
  bg-background
  text-xs
  rounded-full
  w-fit
  select-none
  cursor-pointer
`

export const modalContent = "bg-card rounded-lg p-6 w-full h-full relative overflow-auto";
export const modalHeader = "flex flex-row justify-start items-center mb-4 gap-2";
export const modalTitle = "text-xl font-bold tracking-tighter";
export const modalIconButton = 'border border-foreground/50 hover:border-foreground hover:bg-background rounded-full p-1 cursor-pointer transition-colors duration-700'
export const modalClose = `hover:bg-background rounded-full p-1 cursor-pointer
                           transition-colors duration-700 bg-card absolute
                           top-1 right-1
                           sm:top-[-14] sm:right-[-14]
                           w-8 h-8`;
export const modalLoadingState = "flex flex-col items-center justify-center py-4 w-full gap-4";
export const modalErrorState = "text-red-500 text-center py-4";
export const modalItemsList = "grid gap-2  max-h-[80vh] overflow-y-auto";
export const modalContentScrollable = "w-full max-h-[80vh] overflow-y-auto";
export const modalItemRow = "flex flex-row items-center justify-start gap-2";
export const modalItemInfo = "flex items-center text-[x-small] sm:text-base gap-2";

// ClassNames
export const buttonClassNames = `
flex flex-row gap-2 items-center justify-between
rounded-full bg-primary text-white
w-fit
px-3 py-1
cursor-pointer
select-none
text-sm font-light
shadow-lg
`;

export const buttonNotReadyClassNames = `
flex flex-row gap-2 items-center justify-between
rounded-full bg-backgrond text-foreground/30
border border-primary/50
w-fit
px-4 py-1
cursor-not-allowed
select-none
text-sm font-light
`;

export const dropStyle = `
flex flex-col
rounded-xl
border-[2px] border-dashed
border-foreground/5
p-5
items-center
justify-center
`

export const badgeClasses: string = `
px-3 py-1
text-xxs
bg-primary
text-white
rounded-full
cursor-pointer
select-none
w-fit
`
