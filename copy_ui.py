with open('c:/Users/DELL/Documents/ISAD/mendatar-web/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

ui_block = ''.join(lines[350:602])
ui_block = ui_block.replace('id=\"schedule-tabs\"', 'id=\"schedule-tabs-histori\"')
ui_block = ui_block.replace('id=\"tab-slider\"', 'id=\"tab-slider-histori\"')
ui_block = ui_block.replace('toggleSchedule(', 'toggleScheduleHistori(')
ui_block = ui_block.replace('selectShift(', 'selectShiftHistori(')
ui_block = ui_block.replace('toggleRouteDetail(', 'toggleRouteDetailHistori(')

start_idx = 865
end_idx = 869

new_lines = lines[:start_idx] + [ui_block] + lines[end_idx:]

with open('c:/Users/DELL/Documents/ISAD/mendatar-web/index.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
