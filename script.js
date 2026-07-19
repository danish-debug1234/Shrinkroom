(() => {
  const dropzone = document.getElementById('dropzone');
  const dropzoneInner = document.getElementById('dropzoneInner');
  const fileInput = document.getElementById('fileInput');
  const preview = document.getElementById('preview');
  const controls = document.getElementById('controls');
  const canvas = document.getElementById('workCanvas');
  const ctx = canvas.getContext('2d');

  const originalSizeEl = document.getElementById('originalSize');
  const outputSizeEl = document.getElementById('outputSize');
  const reductionPctEl = document.getElementById('reductionPct');

  const qualitySlider = document.getElementById('qualitySlider');
  const qualityReadout = document.getElementById('qualityReadout');
  const maxDimSlider = document.getElementById('maxDimSlider');
  const maxDimReadout = document.getElementById('maxDimReadout');
  const formatToggle = document.getElementById('formatToggle');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn = document.getElementById('resetBtn');

  let img = null;
  let originalBytes = 0;
  let originalName = 'photo';
  let currentFormat = 'image/jpeg';
  let currentBlob = null;
  let debounceTimer = null;

  function bytesToLabel(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function openFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    originalBytes = file.size;
    originalName = (file.name || 'photo').replace(/\.[^.]+$/, '');

    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        img = image;
        preview.src = e.target.result;
        preview.hidden = false;
        dropzoneInner.hidden = true;
        controls.hidden = false;
        originalSizeEl.textContent = bytesToLabel(originalBytes);
        render();
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function render() {
    if (!img) return;
    const maxDim = parseInt(maxDimSlider.value, 10);
    let { width, height } = img;
    const scale = Math.min(1, maxDim / Math.max(width, height));
    width = Math.round(width * scale);
    height = Math.round(height * scale);

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const quality = parseInt(qualitySlider.value, 10) / 100;
    const usesQuality = currentFormat !== 'image/png';

    canvas.toBlob(
      (blob) => {
        currentBlob = blob;
        outputSizeEl.textContent = bytesToLabel(blob.size);
        const reduction = originalBytes > 0
          ? Math.max(0, Math.round((1 - blob.size / originalBytes) * 100))
          : 0;
        reductionPctEl.textContent = `${reduction}%`;
      },
      currentFormat,
      usesQuality ? quality : undefined
    );
  }

  function scheduleRender() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, 80);
  }

  // --- file input / drag & drop ---
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') fileInput.click();
  });
  dropzone.setAttribute('tabindex', '0');
  dropzone.setAttribute('role', 'button');
  dropzone.setAttribute('aria-label', 'Choose an image file');

  fileInput.addEventListener('change', (e) => openFile(e.target.files[0]));

  ['dragenter', 'dragover'].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    })
  );
  ['dragleave', 'drop'].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    })
  );
  dropzone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    openFile(file);
  });

  // --- sliders ---
  qualitySlider.addEventListener('input', () => {
    qualityReadout.textContent = `${qualitySlider.value}%`;
    scheduleRender();
  });
  maxDimSlider.addEventListener('input', () => {
    maxDimReadout.textContent = `${maxDimSlider.value}px`;
    scheduleRender();
  });

  // --- format toggle ---
  formatToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.format-btn');
    if (!btn) return;
    formatToggle.querySelectorAll('.format-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFormat = btn.dataset.format;
    qualitySlider.disabled = currentFormat === 'image/png';
    render();
  });

  // --- download ---
  downloadBtn.addEventListener('click', () => {
    if (!currentBlob) return;
    const ext = currentFormat.split('/')[1];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(currentBlob);
    a.download = `${originalName}-shrunk.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // --- reset ---
  resetBtn.addEventListener('click', () => {
    img = null;
    currentBlob = null;
    fileInput.value = '';
    preview.hidden = true;
    dropzoneInner.hidden = false;
    controls.hidden = true;
    originalSizeEl.textContent = '—';
    outputSizeEl.textContent = '—';
    reductionPctEl.textContent = '—';
  });
})();
