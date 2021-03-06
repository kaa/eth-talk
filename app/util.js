export function range(start, stop, step) {
  if (start === undefined) {
    return [];
  }
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (!step) {
    step = stop < start ? -1 : 1;
  }

  var length = Math.max(Math.ceil((stop - start) / step), 0)+1;
  var range = Array(length);

  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }

  return range;
}

function promisify(fn) {
  var args = Array.from(arguments).slice(1);
  return new Promise((res,rej) => {
    fn.apply(this, args.concat([(err,result) => err ? rej(err) : res(result)]));
  });
}