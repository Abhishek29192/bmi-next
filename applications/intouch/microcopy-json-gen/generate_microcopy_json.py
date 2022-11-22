import argparse
import json
import os
import re
import sys

import pandas as pd
from flatten_dict import unflatten

parser = argparse.ArgumentParser()
parser.add_argument("--srcfile", "-s", help='XLSX file of microcopy source (Microcopy source of truth.xlsx, by default)', type=str, required=False, default='Microcopy source of truth.xlsx')
parser.add_argument("--dstdir", "-d", help='Directory to store JSON microcopy files (locales, by default)', type=str, required=False, default='locales')
args = parser.parse_args()

src_file = args.srcfile
dst_dir = args.dstdir
markets = ['en_EN', 'nb_NO', 'it_IT', 'da_DK', 'de_DE', 'es_ES', 'pt_PT', 'en_MY', 'fi_FI', 'en_UK', 'sv_SE', 'pl_PL']

try:
    sheets = pd.read_excel(src_file, sheet_name=None)

    for market in markets:

        print(f'>>> {market} >>>')

        for sh in sheets:
            if sh != 'COVER PAGE' and sh != 'role_assigned' and sh != 'status_code_errors' and not sh.startswith('auth0'):
                print(sh)

                df = pd.read_excel(src_file, sheet_name=sh, index_col=0,)

                market_code = market.split('_')[-1]

                d = df.to_dict()[market_code]

                d_fmt={}
                for k, v in d.items():
                    if re.search('\n\n', str(v)):
                        d_fmt[k] = v.split('\n\n')
                    else:
                        d_fmt[k]=d[k]

                if not (sh.endswith('.html') or sh.endswith('.ht')):
                    d_fmt = unflatten(d_fmt, splitter='path')

                if not os.path.exists(f'{dst_dir}/{market}'):
                    os.makedirs(f'{dst_dir}/{market}')

                dw = json.dumps(d_fmt, ensure_ascii=False, indent=2)
                dw = dw.replace('NaN', '\"N/A\"')
                with open(f'{dst_dir}/{market}/{sh}', 'w') as f:
                    f.write(dw)

        print('\n')
    
    sys.exit(0)

except FileNotFoundError:
    sys.exit(f'No such XLSX file of microcopy source found: {src_file}')
