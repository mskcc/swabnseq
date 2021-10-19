import csv
import json

f_name = 'FILE_NAME'

doc = []
with open(f_name + '.txt') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter='\t')
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            print(f'Column names are {", ".join(row)}')
            line_count += 1
        else:
            org = {
                'org': row[2],
                'count': row[1]
            }
            doc.append(org)
            line_count += 1
    print(f'Processed {line_count} lines.')

js_file = f_name + '_output.js'
f = open(js_file, "a")
open(js_file, 'w').close()
f.write('const data = ' + json.dumps((doc)) + ';\nexport default data;\n')
f.close()